(function (global) {

  var MAX_CHANNEL_NUM = 16;
  var MAX_NOTE_NUM = 128;

  function TrackScheduler(pContext, pResolution, pTempo) {
    this.context = pContext;
    this.resolution = pResolution; // Delta value of a quarter note.
    this.tempo = pTempo; // length of a quarter note in micro seconds.
    this.currentTime = new Array(MAX_CHANNEL_NUM); // variable to hold current time
    for (var i = 0, il = this.currentTime.length; i < il; i++) {
      this.currentTime[i] = 0;
    }
    this.channels = new Array(MAX_CHANNEL_NUM);
    this.sourceNodes = new Array();
  }

  TrackScheduler.prototype.scheduleNoteOn  = function (pDelta, pCh, pNote, pVelo) {

    var tNote = {
        pitch: -5100 + pNote * 100, // Cent
        velocity : pVelo,
        start : 0,
        end: 0
      };
    tNote.start = (this.currentTime[pCh] += pDelta * this.tempo / this.resolution);

    if (this.channels[pCh] === void 0) {
      this.channels[pCh] = [tNote];
    } else {
      this.channels[pCh].push(tNote);
    }
  };

  TrackScheduler.prototype.scheduleNoteOff = function (pDelta, pCh, pNote, pVelo) {

    var tChannel = this.channels[pCh], tLast;
    if (tChannel) {
      tLast = tChannel[tChannel.length - 1];
      tLast.end = (this.currentTime[pCh] += pDelta * this.tempo / this.resolution);
    }
  };

  TrackScheduler.prototype.scheduleDone = function () {

    var tContext = this.context, 
        tOscilNode, tGainNode, 
        tCent, tGain, tNoteList, tStartTime, tEndTime;

    for (var i = 0; i < MAX_CHANNEL_NUM; i++) {
      if (this.channels[i] === void 0) {
        continue;
      }
      tOscilNode = tContext.createOscillator();
      tGainNode = tContext.createGainNode();
      tOscilNode.connect(tGainNode);
      tGainNode.connect(tContext.destination);
      tOscilNode.type = 0;
      this.sourceNodes.push(tOscilNode);
      tCent = tOscilNode.detune;
      tGain = tGainNode.gain;
      tNoteList = this.channels[i];

      for (var j = 0, jl = tNoteList.length; j < jl; j++) {
        tStartTime = tNoteList[j].start / 1000000; // Time offset in Sec (micro sec => sec)
        tEndTime = tNoteList[j].end / 1000000; // Time offset in Sec (micro sec => sec)
        tCent.setValueAtTime(tNoteList[j].pitch, tStartTime);
        tGain.setValueAtTime(0.5, tStartTime); 
        tGain.linearRampToValueAtTime(0.0, tEndTime); 
        //console.log('pitch=' + tNoteList[j].pitch + ', start=' + tNoteList[j].start / 1000000 + ', end=' + tNoteList[j].end / 1000000); 
      }
    }
  };

  TrackScheduler.prototype.play = function () {
    for (var i = 0, il = this.sourceNodes.length; i < il; i++) {
      this.sourceNodes[i].noteOn(0);
    }
  };

  TrackScheduler.prototype.stop = function () {
    for (var i = 0, il = this.sourceNodes.length; i < il; i++) {
      this.sourceNodes[i].noteOff(0);
    }
  };

  global.TrackScheduler = TrackScheduler;

}(this));
