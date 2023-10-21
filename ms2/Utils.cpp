/*
*****************************************************************************
                              Menu.h
Full Name  : Nishnath Bandari
Student ID#: 105202220
Email      : nbandari1@myseneca.ca
Date of completion    : 21 July 2022

I have done all the coding by myself and only copied the code that my professor provided to complete my workshops and assignments.
*****************************************************************************
*/

#include "Utils.h"

namespace sdds {
	void strnCpy(char* des, const char* src, int len) {
		int i = 0;
		for (i = 0; i < len; i++) {
			des[i] = src[i];
		}
	}
	int strLen(const char* s) {
		int i;
		for (i = 0; s[i] != '\0'; i++) {
		};
		return i;
	}

}