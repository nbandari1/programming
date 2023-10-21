/*/////////////////////////////////////////////////////////////////////////
Milestone - #4
Name : Nishnath Bandari
Student ID : 105202220
Email : nbandari1@myseneca.ca
Course & Section   : BTP200 NAA
Date of completion : August 2, 2023

Authenticity Declaration :
I have done all the coding by myself and only copied the code that my professor provided to complete my workshops and assignments.
/////////////////////////////////////////////////////////////////////////*/

#include <iostream>
#include "Utils.h"

namespace sdds {
    int getIntegerInput(int minRange, int maxRange) {
        int input;
        bool validInt = false;
        while (validInt == false)
        {
            std::cin >> input;
            if (!std::cin || input < minRange || input > maxRange)
            {
                std::cout << "Invalid Selection, try again: ";
                std::cin.clear();
                std::cin.ignore(1000, '\n');
                validInt = false;
            }
            else
            {
                validInt = true;
            }

        }
        return input;
    }
    void strCpy(char* des, const char* src) {
        int srcLen = strLen(src), j;

        for (j = 0; j < srcLen + 1; j++)
            des[j] = src[j];
    }
    int strLen(const char* s) {
        int i;
        for (i = 0; s[i] != '\0'; i++) {
        };
        return i;
    }
    void strnCpy(char* des, const char* src, int count) {
        int i = 0;
        while (i < count && src[i] != '\0')
        {
            des[i] = src[i];
            i++;
        }
        while (i < count)
        {
            des[i] = '\0';
            i++;
        }

    }
}