import { firstValueFrom } from '../core'

export class AggregateUserNameProvider {
    constructor({ underlyingProviders }) {
        this.underlyingProviders = underlyingProviders;
    }

    async get() {
        return await firstValueFrom(this.underlyingProviders);
    }
}