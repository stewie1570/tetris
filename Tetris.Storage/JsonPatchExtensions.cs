using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MongoDB.Driver;
using System;
using System.Linq;

public static class JsonPatchExtensions
{
    public static UpdateDefinition<T> ToMongoUpdate<T>(this JsonPatchDocument<T> jsonPatch) where T : class
    {
        if (jsonPatch == null)
        {
            throw new ArgumentNullException(nameof(jsonPatch));
        }

        var updates = jsonPatch.Operations
            .Select(ConvertOperationToUpdate)
            .ToList();

        return Builders<T>.Update.Combine(updates);
    }

    #region Helpers

    private static UpdateDefinition<T> ConvertOperationToUpdate<T>(Operation<T> operation) where T : class
    {
        var field = GetField(operation.path.Trim('/').Replace("/", "."));
        var value = operation.value;

        return operation.op switch
        {
            "add" => Builders<T>.Update.Set(field, value),
            "replace" => Builders<T>.Update.Set(field, value),
            "remove" => Builders<T>.Update.Unset(field),
            "copy" => throw new NotImplementedException("Copy operation not supported"),
            "move" => throw new NotImplementedException("Move operation not supported"),
            "test" => throw new NotImplementedException("Test operation not supported"),
            _ => throw new NotSupportedException($"Operation {operation.op} is not supported"),
        };
    }

    private static string GetField(string path)
    {
        return path.TrimStart('/');
    }

    #endregion
}
