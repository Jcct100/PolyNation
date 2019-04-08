import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlayCircle,
    faStopCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import AudioWave from '../components/AudioWave';
import AudioPlayerContext from './context';

// eslint-disable-next-line react/prefer-stateless-function
class PlaybarContainer extends React.Component {
    render() {
        return (
            <AudioPlayerContext.Consumer>
                {({
                    title,
                    gigArtistSrc,
                    gigTitle,
                    gigSubtitle,
                    gigArtistAlt,
                    stopAudio,
                    playAudio,
                    playing,
                    volume,
                    checkVolume,
                    gigID,
                    volumeIcon,
                    audioInputRangeInnerStyle
                }) => {
                    return (

                        <div className="playbar-container">
                            <div className="artist">
                                <div className="artist-image-wrapper">
                                    <img className="artist-image" src={gigArtistSrc} alt={gigArtistAlt} />
                                </div>
                                <div className="artist-info">
                                    <Link to={`/gig/${gigID}`}><h4 className="artist-info-title">{gigTitle}</h4></Link>
                                    <p className="artist-info-subtitle">{gigSubtitle}</p>
                                </div>
                                <div>{title}</div>
                            </div>
                            <div className="audio-player">
                                <div className="audio-player-play-button">
                                    {playing
                                        ? <FontAwesomeIcon icon={faStopCircle} color="white" size="4x" onClick={stopAudio} />
                                        : <FontAwesomeIcon icon={faPlayCircle} color="white" size="4x" onClick={gigID ? playAudio : null} />
                                    }
                                </div>
                                { <AudioWave playing={playing} /> }
                            </div>
                            <div className="audio">
                                <div className="audio-speakericon">
                                    <FontAwesomeIcon icon={volumeIcon} color="white" size="4x" />
                                </div>
                                <div className="audio-inputrange">
                                    <div className="audio-inputrange-outerStyle">
                                        <div style={audioInputRangeInnerStyle}>
                                            <input type="range" min="0" max="1" defaultValue={volume} step="0.1" onChange={checkVolume} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </AudioPlayerContext.Consumer>
        );
    }
}

PlaybarContainer.contextType = AudioPlayerContext;

export default PlaybarContainer;
