namespace Tetris.Core.Exceptions
{
    public class ValidationException : DomainException
    {
        public ValidationException(string message) : base(message) { }
    }
}
