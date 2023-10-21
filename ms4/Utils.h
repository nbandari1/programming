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

#ifndef SDDS_UTILS_H__
#define SDDS_UTILS_H__
#include <iostream>

namespace sdds {
    // Gets an integer as input and validates the range as well. It prints a message if the range isn't valid and prompts again
    int getIntegerInput(int minRange, int maxRange);
    void strCpy(char* des, const char* src);
    int strLen(const char* s);
    void strnCpy(char* des, const char* src, int count);
}

#endif
