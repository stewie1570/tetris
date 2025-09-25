import React from 'react';
import { useLocalPlayerGameContext } from './LocalPlayerGame';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowDown, faRotate, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { MovingDown, MovingLeft, MovingRight, RotatingIcon } from './components/AnimatedIcons';

export const ControlLegend = () => {
    const { game } = useLocalPlayerGameContext();
    const isMobile = game?.mobile;

    return !isMobile && <div className="card mb-3">
        <div className="card-body">
            <h5 className="card-title" style={{ 
                color: '#2d3748', 
                fontWeight: '700', 
                fontSize: '1.25rem',
                marginBottom: '1rem'
            }}>🎮 Controls</h5>
            <div className="card-text">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ color: '#4a5568', fontWeight: '600' }}>Key</th>
                            <th style={{ color: '#4a5568', fontWeight: '600' }}>Command</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ 
                                fontSize: '1.2rem',
                                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                                borderRadius: '8px',
                                padding: '8px',
                                textAlign: 'center',
                                width: '60px'
                            }}>
                                <FontAwesomeIcon icon={faArrowUp} style={{ color: '#4c63d2' }} />
                            </td>
                            <td>
                                Rotate <RotatingIcon icon={faRotate} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ 
                                fontSize: '1.2rem',
                                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                                borderRadius: '8px',
                                padding: '8px',
                                textAlign: 'center',
                                width: '60px'
                            }}>
                                <FontAwesomeIcon icon={faArrowDown} style={{ color: '#4c63d2' }} />
                            </td>
                            <td>
                                Move <MovingDown icon={faArrowDown} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ 
                                fontSize: '1.2rem',
                                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                                borderRadius: '8px',
                                padding: '8px',
                                textAlign: 'center',
                                width: '60px'
                            }}>
                                <FontAwesomeIcon icon={faArrowLeft} style={{ color: '#4c63d2' }} />
                            </td>
                            <td>
                                Move <MovingLeft icon={faArrowLeft} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ 
                                fontSize: '1.2rem',
                                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                                borderRadius: '8px',
                                padding: '8px',
                                textAlign: 'center',
                                width: '60px'
                            }}>
                                <FontAwesomeIcon icon={faArrowRight} style={{ color: '#4c63d2' }} />
                            </td>
                            <td>
                                Move <MovingRight icon={faArrowRight} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ 
                                fontSize: '1rem', 
                                fontWeight: '600',
                                color: '#4c63d2',
                                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                                borderRadius: '8px',
                                padding: '8px',
                                textAlign: 'center',
                                width: '60px'
                            }}>
                                [Space]
                            </td>
                            <td>
                                Drop to bottom
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}