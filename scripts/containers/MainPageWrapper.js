import React, { Component } from 'react';
import {
    faVolumeOff,
    faVolumeDown,
    faVolume,
    faVolumeUp,
    faVolumeSlash
} from '@fortawesome/pro-light-svg-icons';
import MapWrapper from './MapWrapper';
import SidebarWrapper from './SidebarWrapper';
import Playbar from './Playbar';
import { getLiveGigs } from '../api';
import { formatGigTitle } from '../utilities';
import AudioPlayerContext from './context';

class MainPageWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gigArtistSrc: '',
            gigArtistAlt: '',
            gigTitle: '',
            gigSubtitle: '',
            playing: false,
            id: '',
            streamURL: '',
            volume: 0.5,
            volumeIcon: faVolumeDown,
            audioInputRangeInnerStyle: {
                backgroundColor: '#8a12f4',
                height: '100%',
                width: '50%'
            }
        };

        this.audioEl = null;

        this.handleChange = this.handleChange.bind(this);
        this.playAudio = this.playAudio.bind(this);
        this.stopAudio = this.stopAudio.bind(this);
        this.onAudioChange = this.onAudioChange.bind(this);
    }

    onAudioChange(e) {
        // save the volume number
        const volume = parseFloat(e.target.value);

        // get the percentage of the volume selected
        const volumePercentage = this.convertVolumePercentage(volume);

        const volumeIcon = this.checkVolumeIcon(volume);

        // and set to state so when user click play again it will be set.
        this.setState({
            volume,
            volumeIcon,
            audioInputRangeInnerStyle: {
                backgroundColor: '#8a12f4',
                height: '100%',
                width: volumePercentage
            }
        });

        // set volume of audio, so when its playing it will listen to the audio and change the volume
        // need to check it is not null as you might change volume after stop and before play when this.audioEl is set to null
        if (this.audioEl !== null) {
            this.audioEl.volume = volume;
        }
    }

    playAudio() {
        getLiveGigs(this.state.id, 'yes')
            .then((res) => {
                // get the new streamURL
                this.setState({
                    streamURL: res.directives.PLAYBAR_DIRECTIVE.data.stream_audio.stream_url,
                    playing: true
                }, this.createLiveStream);
            });
    }

    createLiveStream() {
        // create instance
        const myAudio = new Audio(this.state.streamURL);
        // set volume
        myAudio.volume = this.state.volume;
        // play audio
        myAudio.play();

        this.audioEl = myAudio;

        // set instance as state
        this.setState({
            playing: true
        });
    }

    stopAudio() {
        // replace audio src to an empty str to stop the stream
        this.audioEl.pause();
        this.audioEl.src = '';
        this.audioEl = null;

        // set state to playing false and myAudio to null to remove from state
        this.setState({
            playing: false
        });
    }

    // when user click listen now from side bar will run this function
    handleChange(id) {
        // remove instance if exisits before get response from API
        if (this.audioEl) {
            this.stopAudio();
        }

        getLiveGigs(id, 'yes')
            .then((res) => {
                this.setState({
                    gigTitle: formatGigTitle(res.directives.PLAYBAR_DIRECTIVE.data.stream_display.title),
                    gigSubtitle: res.directives.PLAYBAR_DIRECTIVE.data.stream_display.subtitle,
                    gigArtistSrc: res.directives.PLAYBAR_DIRECTIVE.data.stream_display.profile_image.src,
                    gigArtistAlt: res.directives.PLAYBAR_DIRECTIVE.data.stream_display.profile_image.alt,
                    streamURL: res.directives.PLAYBAR_DIRECTIVE.data.stream_audio.stream_url,
                    id
                }, this.createLiveStream);
            });
    }

    // eslint-disable-next-line class-methods-use-this
    checkVolumeIcon(volume) {
        // assign the volume icon name depending on the volume level
        let volumeIcon;

        if (volume === 0) {
            volumeIcon = faVolumeSlash;
        }

        if (volume > 0 && volume <= 0.2) {
            volumeIcon = faVolumeOff;
        }

        if (volume > 0.2 && volume <= 0.4) {
            volumeIcon = faVolumeDown;
        }

        if (volume > 0.4 && volume <= 0.6) {
            volumeIcon = faVolume;
        }

        if (volume > 0.6 && volume <= 1) {
            volumeIcon = faVolumeUp;
        }

        return volumeIcon;
    }

    // eslint-disable-next-line class-methods-use-this
    convertVolumePercentage(volume) {
        return `${volume * 100}%`;
    }

    render() {
        return (
            <AudioPlayerContext.Provider value={{
                onChange: this.handleChange,
                playAudio: this.playAudio,
                stopAudio: this.stopAudio,
                checkVolume: this.onAudioChange,
                gigArtistSrc: this.state.gigArtistSrc,
                gigTitle: this.state.gigTitle,
                gigSubtitle: this.state.gigSubtitle,
                gigArtistAlt: this.state.gigArtistAlt,
                playing: this.state.playing,
                volume: this.state.volume,
                gigID: this.state.id,
                volumeIcon: this.state.volumeIcon,
                audioInputRangeInnerStyle: this.state.audioInputRangeInnerStyle
            }}
            >
                <div className="app">
                    <div className="main-container">
                        <SidebarWrapper />
                        <MapWrapper />
                    </div>
                    <Playbar />
                </div>
            </AudioPlayerContext.Provider>
        );
    }
}

export default MainPageWrapper;
