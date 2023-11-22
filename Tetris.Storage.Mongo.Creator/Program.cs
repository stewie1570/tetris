using MongoDB.Bson;
using MongoDB.Driver;


class Program
{
    private const string DbName = "tetris";
    private const string CollectionName = "rooms";

    static void Main(string[] args)
    {
        Console.Write("Enter your MongoDB connection string: ");
        var connectionString = Console.ReadLine();

        try
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(DbName);
            Console.WriteLine($"Collections: {string.Join(", ", database.ListCollectionNames().ToList())}");

            var collection = database.GetCollection<BsonDocument>(CollectionName);

            var keys = Builders<BsonDocument>.IndexKeys.Ascending("Timestamp");
            var indexOptions = new CreateIndexOptions { ExpireAfter = TimeSpan.FromMinutes(5) };
            var indexModel = new CreateIndexModel<BsonDocument>(keys, indexOptions);
            collection.Indexes.CreateOne(indexModel);

            Console.WriteLine($"Index on 'timestamp' property created successfully in '{CollectionName}' collection.");
            // mongodb+srv://admin:<password>@<host>/?retryWrites=true&w=majority
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }
}
