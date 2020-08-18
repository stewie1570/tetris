using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tetris.Core
{
    public class ConcurrentTask
    {
        protected class IndexedTaskProvider<T>
        {
            public int Index { get; set; }
            public Func<Task<T>> TaskProvider { get; set; }
        }

        protected class IndexedResult<T>
        {
            public int Index { get; set; }
            public T Result { get; set; }
        }

        public static async Task WhenAll(IEnumerable<Func<Task>> tasks, int maxConcurrency)
        {
            IEnumerator<Func<Task>> taskEnumerator = tasks.GetEnumerator();
            await Task.WhenAll(Enumerable
                .Range(start: 1, count: maxConcurrency)
                .Select(i => RunInSeries(taskEnumerator)));
        }

        public static async Task<IEnumerable<T>> WhenAll<T>(IEnumerable<Func<Task<T>>> tasks, int maxConcurrency)
        {
            var taskEnumerator = tasks
                .Select((taskProvider, index) => new IndexedTaskProvider<T> { TaskProvider = taskProvider, Index = index })
                .GetEnumerator();

            var resultLists = await Task.WhenAll(Enumerable
                .Range(start: 1, count: maxConcurrency)
                .Select(i => RunInSeries(taskEnumerator)));

            return resultLists
                .SelectMany(resultList => resultList)
                .OrderBy(indexedResult => indexedResult.Index)
                .Select(indexedResult => indexedResult.Result);
        }

        #region Helpers

        private static async Task RunInSeries(IEnumerator<Func<Task>> enumerator)
        {
            if (enumerator.MoveNext())
            {
                await enumerator.Current();
                await RunInSeries(enumerator);
            }
        }

        private static async Task<List<IndexedResult<T>>> RunInSeries<T>(
            IEnumerator<IndexedTaskProvider<T>> enumerator,
            List<IndexedResult<T>> accumalatedValues = null)
        {
            var accumalatedValuesOrEmpty = (accumalatedValues ?? new List<IndexedResult<T>>());

            return enumerator.MoveNext()
                ? await RunInSeries(enumerator, accumalatedValuesOrEmpty
                    .Concat(new IndexedResult<T> { Index = enumerator.Current.Index, Result = await enumerator.Current.TaskProvider() })
                    .ToList())
                : accumalatedValuesOrEmpty;
        }

        #endregion
    }
}