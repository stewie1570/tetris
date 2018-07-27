import { willResolve } from '../helpers'
import { AggregateUserNameProvider } from '../../domain/aggregate-username-provider'

describe("User Name Provider", () => {
    it("should ask a providing function for the username then provide it", async () => {
        //Arrange
        let persistedUsername = undefined;
        const userNameProvider = new AggregateUserNameProvider({
            underlyingProviders: [() => willResolve("stewie")]
        });

        //Act
        //Assert
        expect(await userNameProvider.get()).toBe("stewie");
    });

    it("should ask only the first username provider that provides a username", async () => {
        //Arrange
        const userNameProvider = new AggregateUserNameProvider({
            underlyingProviders: [() => "first", () => willResolve("stewie")]
        });

        //Act
        //Assert
        expect(await userNameProvider.get()).toBe("first");
    });

    it("should continue asking username providers until a username is found", async () => {
        //Arrange
        const userNameProvider = new AggregateUserNameProvider({
            underlyingProviders: [() => undefined, () => willResolve("stewie")]
        });

        //Act
        //Assert
        expect(await userNameProvider.get()).toBe("stewie");
    });
});