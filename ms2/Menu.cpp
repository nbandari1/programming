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

#include "Menu.h"	
#include "Utils.h"
#include <cstring>
#include <climits>
#include <iostream>
#include <string>
#define _CRT_SECURE_NO_WARNINGS

namespace sdds
{
	MenuItem::MenuItem()
	{
		menuContent = nullptr;
	}

	MenuItem::MenuItem(const char* menu_content)
	{
		if (menu_content)
		{
			const auto length = strLen(menu_content);
			menuContent = new char[length + 1];
			strnCpy(menuContent, menu_content, length + 1);
		}
	}

	MenuItem::~MenuItem()
	{
		delete[] menuContent;
	}

	MenuItem::operator bool() const
	{
		return menuContent != nullptr;
	}

	MenuItem::operator const char* () const
	{
		return menuContent;
	}

	void display(std::ostream& out, const MenuItem& menuItem)
	{
		if (menuItem.menuContent)
			out << menuItem.menuContent;
	}

	Menu::Menu() : m_title(), m_size()
	{}

	Menu::Menu(const char* title) : m_title(title), m_size()
	{}

	Menu::~Menu()
	{
		for (int i = 0; i < m_size; ++i)
		{
			delete m_items[i];
		}
	}

	void displayTitle(std::ostream& out, const Menu& menu)
	{
		display(out, menu.m_title);
	}

	void Menu::displayMenu() const
	{
		if (m_title)
		{
			displayTitle(std::cout, *this);
			std::cout << "\n";
		}

		for (int i = 0; i < m_size; ++i)
		{
			std::cout << ' ' << i + 1 << "- ";
			display(std::cout, *m_items[i]);
			std::cout << '\n';
		}
		std::cout << " 0- Exit\n> ";
	}

	unsigned int Menu::run() const
	{
		displayMenu();
		unsigned int choice = MAX_MENU_ITEMS + 1;
		std::cin >> choice;
		while (std::cin.fail() or choice < 0 or choice > static_cast<unsigned int>(m_size))
		{
			std::cout << "Invalid Selection, try again: ";
			std::cin.clear();
			std::cin.ignore(INT_MAX, '\n');
			std::cin >> choice;
		}
		return choice;
	}

	unsigned int Menu::operator~() const
	{
		return run();
	}

	Menu& Menu::operator<<(const char* menuItemContent)
	{
		if (m_size < MAX_MENU_ITEMS)
		{
			auto newItem = new MenuItem(menuItemContent);
			m_items[m_size++] = newItem;
		}
		return *this;
	}

	Menu::operator int() const
	{
		return m_size;
	}

	Menu::operator unsigned int() const
	{
		return m_size;
	}

	Menu::operator bool() const
	{
		return m_size > 0;
	}

	const char* Menu::operator[](const unsigned int i) const
	{
		return *m_items[i];
	}

	std::ostream& operator<<(std::ostream& out, const Menu& menu)
	{
		displayTitle(out, menu);
		return out;
	}
}


