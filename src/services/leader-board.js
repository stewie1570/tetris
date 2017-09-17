import { Rest } from './rest'

export var leaderBoardRestService = {
    get: () => Rest.get('/api/userScores'),
    postScore: ({ username, score }) => Rest.post({ url: '/api/userScores', data: { username, score } })
}