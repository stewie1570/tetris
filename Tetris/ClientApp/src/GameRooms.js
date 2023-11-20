import { useLoadingState, useMountedOnlyState } from 'leaf-validator';
import React from 'react';
import { useLifeCycle } from './hooks/useLifeCycle';
import { Rest } from './services/rest';
import { Link } from 'react-router-dom';

const Statuses = [
    'Playing',
    'Waiting'
];

export const GameRooms = () => {
    const [gameRooms, setGameRooms] = useMountedOnlyState();
    const [isLoading, showLoadingWhile] = useLoadingState();

    const refresh = async () => {
        try {
            await Rest.get("/api/gameRooms?start=0&count=10").then(setGameRooms);
        } finally {
            setTimeout(refresh, 10000);
        }
    }

    useLifeCycle({
        onMount: () => showLoadingWhile(refresh).then(setGameRooms)
    });

    return <div className="card mt-3">
        <div className="card-body">
            <h5 className="card-title">Game Rooms</h5>
            <div className="card-text">
                {isLoading
                    ? <strong>Loading...</strong>
                    : <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Status</th>
                                <th>Players</th>
                                <th>Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gameRooms?.length
                                ? gameRooms?.map(room => <tr key={room.organizerId}>
                                    <td>
                                        <Link to={`/${room.organizerId}`}>
                                            Join
                                        </Link>
                                    </td>
                                    <td>{Statuses[room.status]}</td>
                                    <td>{Object.values(room.players).map(player => player.username ?? "[Un-named Player]").join(", ")}</td>
                                    <td>{room.organizerId}</td>
                                </tr>)
                                : <tr><td colSpan={4}><strong>No one is hosting a game right now</strong></td></tr>}
                        </tbody>
                    </table>}
            </div>
        </div>
    </div>
}