#include <cs50.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define ALPHABET_SIZE 26

bool is_valid_key(string key);
void get_ciphertext(string key, string plaintext);

int main(int argc, string argv[])
{
    if (argc != 2)
    {
        printf("Usage: ./substitution key\n");
        return 1;
    }

    if (!is_valid_key(argv[1]))
    {
        return 1;
    }

    string key = argv[1];

    string plaintext = get_string("plaintext: ");

    printf("ciphertext: ");
    get_ciphertext(key, plaintext);

    printf("\n");
    return 0;
}

bool is_valid_key(string key)
{
    if (strlen(key) != ALPHABET_SIZE)
    {
        printf("Key must contain 26 characters.\n");
        return false;
    }

    for (int i = 0; i < ALPHABET_SIZE; i++)
    {
        if (!isalpha(key[i]))
        {
            printf("Key must only contain alphabetic characters.\n");
            return false;
        }
    }

    bool seen[ALPHABET_SIZE] = {false};
    for (int i = 0; i < ALPHABET_SIZE; i++)
    {
        char current = tolower(key[i]);
        if (seen[current - 'a'])
        {
            printf("Key must not contain repeated characters.\n");
            return false;
        }
        seen[current - 'a'] = true;
    }

    return true;
}

void get_ciphertext(string key, string plaintext)
{
    for (int i = 0, n = strlen(plaintext); i < n; i++)
    {
        char c = plaintext[i];

        if (isalpha(c))
        {
            char offset = isupper(c) ? 'A' : 'a';
            char cipher_char = tolower(key[c - offset]);
            if (isupper(c))
            {
                cipher_char = toupper(cipher_char);
            }
            printf("%c", cipher_char);
        }
        else
        {
            printf("%c", c);
        }
    }
}
