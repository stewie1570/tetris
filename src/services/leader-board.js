import { Rest } from './rest'

export var leaderBoardRestService = {
    get: () => Rest.get('/api/userScores')
}