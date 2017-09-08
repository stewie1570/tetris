using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using Tetris.Core;

namespace Tetris.Tests.Core
{
    [TestClass]
    public class ExtensionsTests
    {
        [TestMethod]
        public void ConcatShouldAddAValue()
        {
            new List<int> { 1, 2 }.Concat(3).ShouldBeEquivalentTo(new List<int> { 1, 2, 3 });
        }

        [TestMethod]
        public void ConcatShouldCreateNewArrayWithAddedValueWhenArrayIsNull()
        {
            (null as List<int>).Concat(1).ShouldBeEquivalentTo(new List<int> { 1 });
        }
    }
}
