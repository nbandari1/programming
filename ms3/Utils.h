/*/////////////////////////////////////////////////////////////////////////
Milestone - #3
Name : Nishnath Bandari
Student ID : 105202220
Email : nbandari1@myseneca.ca
Course & Section   : BTP200 NAA
Date of completion : July 28, 2023

Authenticity Declaration :
I have done all the coding by myself and only copied the code that my professor provided to complete my workshops and assignments.
/////////////////////////////////////////////////////////////////////////*/

#ifndef SDDS_UTILS_H__
#define SDDS_UTILS_H__
#define _CRT_SECURE_NO_WARNINGS
#include <iostream>

namespace sdds {
    int getIntegerInput(int minRange, int maxRange);
    void strCpy(char* des, const char* src);
    int strLen(const char* s);
}

#endif
