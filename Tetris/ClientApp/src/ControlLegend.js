import React from 'react';
import { useLocalPlayerGameContext } from './LocalPlayerGame';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowDown, faRotate, faArrowUp } from '@fortawesome/free-solid-svg-icons';

export const ControlLegend = () => {
    const { game } = useLocalPlayerGameContext();
    const isMobile = game?.mobile;

    return !isMobile && <div className="card mt-3 mb-3">
        <div className="card-body">
            <h5 className="card-title">Controls Legend</h5>
            <div className="card-text">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Command</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                            </td>
                            <td>
                                Rotate <FontAwesomeIcon icon={faRotate} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FontAwesomeIcon icon={faArrowDown} />
                            </td>
                            <td>
                                Move <FontAwesomeIcon icon={faArrowDown} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </td>
                            <td>
                                Move <FontAwesomeIcon icon={faArrowLeft} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </td>
                            <td>
                                Move <FontAwesomeIcon icon={faArrowRight} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                [Space]
                            </td>
                            <td>
                                Commit all the way down
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}