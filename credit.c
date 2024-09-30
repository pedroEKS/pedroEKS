#include <cs50.h>
#include <stdio.h>
#include <math.h>

bool luhn_check(long number);
int get_length(long number);
void check_card(long number);

int main(void)
{
    long card_number = get_long("Número: ");

    if (luhn_check(card_number))
    {
        check_card(card_number);
    }
    else
    {
        printf("INVALID\n");
    }
}

bool luhn_check(long number)
{
    int sum = 0;
    bool alternate = false;

    while (number > 0)
    {
        int digit = number % 10;

        if (alternate)
        {
            digit *= 2;
            if (digit > 9)
            {
                digit = digit % 10 + 1;
            }
        }

        sum += digit;
        alternate = !alternate;
        number /= 10;
    }

    return (sum % 10) == 0;
}

int get_length(long number)
{
    int length = 0;
    while (number != 0)
    {
        number /= 10;
        length++;
    }
    return length;
}

void check_card(long number)
{
    int length = get_length(number);
    long start_digits = number;

    while (start_digits >= 100)
    {
        start_digits /= 10;
    }

    if ((start_digits == 34 || start_digits == 37) && length == 15)
    {
        printf("AMEX\n");
    }
    else if ((start_digits >= 51 && start_digits <= 55) && length == 16)
    {
        printf("MASTERCARD\n");
    }
    else if ((start_digits / 10 == 4) && (length == 13 || length == 16))
    {
        printf("VISA\n");
    }
    else
    {
        printf("INVALID\n");
    }
}
