#include <cs50.h>
#include <stdio.h>
#include <math.h>

int main(void)
{
    float reais;
    int centavos, moedas = 0;

    do
    {
        reais = get_float("Troca devida: ");
    } while (reais < 0);
    centavos = round(reais * 100);

    moedas += centavos / 25;
    centavos %= 25;

    moedas += centavos / 10;
    centavos %= 10;

    moedas += centavos / 5;
    centavos %= 5;

    moedas += centavos / 1;

    printf("%i\n", moedas);

    return 0;
}
