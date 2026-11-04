using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Validation;

if (args.Length == 0)
{
    Console.Error.WriteLine("Usage: dotnet run --project tools/OpenXmlValidator -- <file.dotm> [...]");
    return 2;
}

var failed = false;

foreach (var path in args)
{
    try
    {
        using var document = WordprocessingDocument.Open(path, false);
        var validator = new OpenXmlValidator();
        var errors = validator.Validate(document).ToList();

        if (errors.Count == 0)
        {
            Console.WriteLine($"PASS {path}");
            continue;
        }

        failed = true;
        Console.WriteLine($"FAIL {path}: {errors.Count} validation error(s)");
        foreach (var error in errors)
        {
            Console.WriteLine($"  [{error.ErrorType}] {error.Description}");
            Console.WriteLine($"    {error.Path?.XPath}");
        }
    }
    catch (Exception exception)
    {
        failed = true;
        Console.WriteLine($"FAIL {path}: {exception.GetType().Name}: {exception.Message}");
    }
}

return failed ? 1 : 0;
