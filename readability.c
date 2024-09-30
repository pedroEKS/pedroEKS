#include <ctype.h>
#include <cs50.h>
#include <stdio.h>
#include <string.h>

int main(void)
{

    string text = get_string("Texto: ");

    int letters = 0;
    int words = 1;
    int sentences = 0;

    for (int i = 0, n = strlen(text); i < n; i++)
    {
        char c = text[i];

        if (isalpha(c))
        {
            letters++;
        }

        if (isspace(c))
        {
            words++;
        }

        if (c == '.' || c == '!' || c == '?')
        {
            sentences++;
        }
    }

    double L = (double)letters / words * 100;
    double S = (double)sentences / words * 100;

    int index = (int)(0.0588 * L - 0.296 * S - 15.8 + 0.5);

    if (index < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (index >= 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %d\n", index);
    }
}
