import { loading } from '../../core/constants'
import { AppController } from '../../controllers/app-controller'

const noOp = () => undefined;

describe("App Controller", () => {
    describe("Post Score", () => {
        it("should post the users score", async () => {
            //Arrange
            var receivedScorePost = null;
            var updatedScoreBoard = [{ username: "stewie", score: 123 }];
            var receivedState = null;

            //Act
            await new AppController({
                leaderBoardService: {
                    postScore: scorePost => { receivedScorePost = scorePost; return Promise.resolve(); },
                    get: () => Promise.resolve(receivedScorePost ? updatedScoreBoard : null)
                },
                setState: state => receivedState = state
            }).postScore({ username: "stewie", score: 100 });

            //Assert
            expect(receivedScorePost).toEqual({
                username: "stewie",
                score: 100
            });
            expect(receivedState).toEqual({ scoreBoard: updatedScoreBoard });
        });

        it("should not post the users score when there is no user name", async () => {
            //Arrange
            var receivedScorePost = null;

            //Act
            await new AppController({
                leaderBoardService: { postScore: scorePost => receivedScorePost = scorePost }
            }).postScore({ username: "", score: 100 });

            //Assert
            expect(receivedScorePost).toBe(null);
        });

        it("should bubble errors thrown from the service", async () => {
            //Arrange
            var receivedScorePost = null;
            var expectedError = new Error();
            var thrownError = null;

            //Act
            try {
                await new AppController({
                    leaderBoardService: { postScore: () => Promise.reject(expectedError) }
                }).postScore({ username: "stewie", score: 100 });
            }
            catch (error) {
                thrownError = error;
            }

            //Assert
            expect(thrownError).toBe(expectedError);
        });
    });

    describe("Pause", () => {
        it("should pause the game", () => {
            //Arrange
            var receivedState = null;
            var setState = state => receivedState = state;

            //Act
            new AppController({ setState, leaderBoardService: { get: noOp } }).pause({ isPaused: false });

            //Assert
            expect(receivedState).toEqual({ paused: true, scoreBoard: loading });
        });

        it("should un-pause the game when already paused", () => {
            //Arrange
            var receivedState = null;
            var setState = state => receivedState = state;
            var getLeaderBoardWasCalled = false;
            var getLeaderBoard = () => getLeaderBoardWasCalled = true;

            //Act
            new AppController({ setState, leaderBoardService: { get: getLeaderBoard } }).pause({ isPaused: true });

            //Assert
            expect(receivedState).toEqual({ paused: false, scoreBoard: null });
            expect(getLeaderBoardWasCalled).toBe(false);
        });

        it("should load the leader board", async () => {
            //Arrange
            var receivedState = null;
            var setState = state => { receivedState = state };
            var currentScoreBoard = [{ username: "stewie", score: 123 }];
            var leaderBoardService = { get: () => Promise.resolve(currentScoreBoard) };

            //Act
            await new AppController({ setState, leaderBoardService }).pause({ isPaused: false });

            //Assert
            expect(receivedState).toEqual({ scoreBoard: currentScoreBoard });
        });

        it("should remove the leader board when failing to load the leader board", async () => {
            //Arrange
            var receivedState = null;
            var setState = state => { receivedState = state; }
            var expectedError = new Error();
            var leaderBoardService = { get: () => Promise.reject(expectedError) };
            var thrownError = null;

            //Act
            try {
                await new AppController({ setState, leaderBoardService }).pause({ isPaused: false });
            }
            catch (error) {
                thrownError = error;
            }

            //Assert
            expect(thrownError).toBe(expectedError)
            expect(receivedState).toEqual({ scoreBoard: null });
        });
    });
});