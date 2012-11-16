/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 Kuu Miyazaki.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.miditacion = {};
  global.miditacion.Parser = Parser;

  /**
   * @constructor
   */
  function Parser(pBuffer, pContext) {
    /**
     * The Breader object for this parser.
     * @type {Breader}
     */
    this.r = new global.Breader(pBuffer);

    /**
     * AudioContext object.
     * @type {AudioContext}
     */
    this.ctx = pContext;

    /**
     * Number of tracks.
     * @type {Number}
     */
    this.trackNum = 0;

    /**
     * Delta value of a quarter note.
     * @type {Number}
     */
    this.resolution = 0;
  }

  Parser.prototype = /** @lends {quickswf.Parser#} */ {

    /**
     * Parses the current buffer.
     * @param {Function=} pSuccessCallback The callback to call on success.
     * @param {Function=} pFailureCallback The callback to call on failure.
     */
    parse: function(pSuccessCallback, pFailureCallback) {
      var tReader = this.r;
      var tFirstStr = tReader.sp(4);

      if (tFirstStr === 'MThd') {
        // Standard MIDI file
        this.parseSMF(pSuccessCallback, pFailureCallback);

      } else if (tFirstStr === 'melo') {
        // NTT docomo's MFi file format
      } else {
        // SMAF
      }
    },

    /**
     * Parses the current buffer.
     * @param {Function=} pSuccessCallback The callback to call on success.
     * @param {Function=} pFailureCallback The callback to call on failure.
     */
    parseSMF: function(pSuccessCallback, pFailureCallback) {
      // Parse header chunk.
      var tReader = this.r;
      var tHeaderSize = tReader.I32();
      var tFormat = tReader.I16();
      var tTrackNum = this.trackNum = tReader.I16();
      this.resolution = tReader.I16();

      for (var i = 0; i < tTrackNum; i++) {
        this.parseTrackChunk();
      }
      pSuccessCallback();
    },

    parseTrackChunk: function() {
    }
  };

}(this));
