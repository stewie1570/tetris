using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Tetris;

public class ExceptionHubFilter : IHubFilter
{

    public async ValueTask<object> InvokeMethodAsync(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object>> next)
    {
        try
        {
            return await next(invocationContext);
        }
        catch (Exception ex)
        {
            NewRelic.Api.Agent.NewRelic.NoticeError(ex);
            throw;
        }
    }
}
