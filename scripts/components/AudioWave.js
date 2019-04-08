import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SineWaves from 'sine-waves';

class AudioWave extends Component {
    constructor(props) {
        super(props);

        this.playWaves = [
            {
                timeModifier: 8,
                lineWidth: 2,
                amplitude: -12.5,
                wavelength: 100
            },
            {
                timeModifier: 6,
                lineWidth: 3,
                amplitude: -15,
                wavelength: 50
            },
            {
                timeModifier: 4,
                lineWidth: 2,
                amplitude: -13,
                wavelength: 75
            },
            {
                timeModifier: 2,
                lineWidth: 4,
                amplitude: -12.5,
                wavelength: 150
            },
            {
                timeModifier: 1,
                lineWidth: 1,
                amplitude: -15,
                wavelength: 200
            },
            {
                timeModifier: 0.5,
                lineWidth: 2,
                amplitude: -13,
                wavelength: 300
            }
        ];

        this.pauseWaves = [
            {
                timeModifier: 8,
                lineWidth: 2,
                amplitude: 0,
                wavelength: 100
            }
        ];
    }

    componentDidMount() {
        const self = this;

        const audioWave = new SineWaves({
            // canvas element
            el: document.getElementById('waves'),

            width() {
                return document.getElementById('audio-wave').clientWidth;
            },

            height: 50,
            speed: 4,
            ease: 'SineInOut',
            // specific how much the width of the canvas the waves should be
            wavesWidth: '100%',

            waves: self.props.playing ? self.playWaves : self.pauseWaves,

            // Called on window resize
            resizeEvent() {
                self.updateWaveColours(this);
            }
        });

        this.audioWave = audioWave;
    }

    componentDidUpdate(prevProps) {
        if (this.props.playing !== prevProps.playing) {
            this.audioWave.waves = this.props.playing ? this.playWaves : this.pauseWaves;
            this.audioWave.setupWaveFns();
            this.audioWave.update();

            this.updateWaveColours(this.audioWave);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    updateWaveColours(audioWave) {
        const gradient = audioWave.ctx.createLinearGradient(0, 0, audioWave.width, 0);
        gradient.addColorStop(0, 'rgba(180, 33, 144, 1.5)');
        gradient.addColorStop(0.5, 'rgba(159, 72, 196, 0.5)');
        gradient.addColorStop(1, 'rgba(180, 33, 144, 1.5)');

        let index = -1;

        while (++index < audioWave.waves.length) {
            // eslint-disable-next-line no-param-reassign
            audioWave.waves[index].strokeStyle = gradient;
        }
    }

    render() {
        return (
            <div id="audio-wave" className="audio-wave">
                <canvas className="waves" id="waves" />
            </div>
        );
    }
}

AudioWave.propTypes = {
    playing: PropTypes.bool.isRequired
};

export default AudioWave;
