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

#ifndef SDDS_LIBAPP_H
#define SDDS_LIBAPP_H

#include <iostream>
#include "Menu.h"

namespace sdds {
    class LibApp {

        bool m_changed;
        Menu m_mainMenu;
        Menu m_exitMenu;
        bool confirm(const char* message);
        
        void load();
        void save();
        void search();
        void returnPub();

        void newPublication();
        void removePublication();
        void checkOutPub();

    public:
        LibApp();
        void run();
    };
}

#endif
