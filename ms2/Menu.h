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

#ifndef SDDS_MENU_H
#define SDDS_MENU_H

#include <iostream>

namespace sdds {
    const int  MAX_MENU_ITEMS = 20;
	class Menu;
    class MenuItem {
		char* menuContent;
		MenuItem();
		MenuItem(const char* menu_content);
		MenuItem(const MenuItem& menu_item) = delete;
		MenuItem& operator=(const MenuItem& menu_item) = delete;
		~MenuItem();
		operator bool() const;
		operator const char* () const;
		friend void display(std::ostream& out, const MenuItem& menuItem);

        friend class Menu;
    };

	class Menu
	{
		MenuItem m_title;
		MenuItem* m_items[MAX_MENU_ITEMS];
		int m_size;

	public:
		Menu();
		Menu(const char* title);
		~Menu();
		Menu(const Menu& menu) = delete;
		Menu& operator=(const Menu& menu) = delete;
		friend void displayTitle(std::ostream& out, const Menu& menu);
		void displayMenu() const;
		unsigned int run() const;
		unsigned int operator~() const;
		Menu& operator<<(const char* menuItemContent);
		operator int() const;
		operator unsigned int() const;
		operator bool() const;
		const char* operator[](const unsigned int i) const;
	};
	std::ostream& operator<<(std::ostream& out, const Menu& menu);
}

#endif