#include <cs50.h>
#include <stdio.h>
#include <math.h>

int main(void)
{
    int start_size;
    do
    {
        start_size = get_int("Start size: ");
    }
    while (start_size < 9);

    int end_size;
    do
    {
        end_size = get_int("End size: ");
    }
    while (end_size < start_size);

    int years = 0;
    int population = start_size;

    while (population < end_size)
    {
        int born = population / 3;
        int death = population / 4;
        population = population + born - death;
        years++;
    }

    printf("Years: %i\n", years);
}
