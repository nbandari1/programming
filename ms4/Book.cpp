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

#include "Book.h"
#include "Utils.h"
#include <iostream>
#include <iomanip>

namespace sdds {
	Book::Book() : Publication() {
		setBookEmpty();
	}
	Book::~Book() {
		delete[] m_authorName;
	}
	Book::Book(const Book& book) : Publication(book) {
		if (m_authorName) {
			delete[] m_authorName;
			m_authorName = nullptr;
		}
		m_authorName = new char[strLen(book.m_authorName) + 1];
		strCpy(m_authorName, book.m_authorName);
	}
	Book& Book::operator=(const Book& book) {
		Publication::operator=(book);

		if (m_authorName) {
			delete[] m_authorName;
			m_authorName = nullptr;
		}

		if (book.m_authorName) {
			m_authorName = new char[strLen(book.m_authorName) + 1];
			strCpy(m_authorName, book.m_authorName);
		}

		return *this;
	}
	void Book::setBookEmpty() {
		m_authorName = nullptr;
	}
	char Book::type() const {
		return 'B';
	}
	std::ostream& Book::write(std::ostream& os) const {
		Publication::write(os);
		if (conIO(os)) {
			char author[SDDS_AUTHOR_WIDTH + 1] = { 0 };
			strnCpy(author, m_authorName, SDDS_AUTHOR_WIDTH);
			os << " ";
			os << std::setw(SDDS_AUTHOR_WIDTH) << std::left << std::setfill(' ') << author << " |";
		}
		else {
			os << "\t" << m_authorName;
		}

		return os;
	}
	std::istream& Book::read(std::istream& is) {
		char authorName[256] = { 0 };

		Publication::read(is);

		if (m_authorName) {
			delete[] m_authorName;
			m_authorName = nullptr;
		}

		if (conIO(is)) {
			is.ignore(); //ignore '\n'
			std::cout << "Author: ";
		}
		else {
			is.ignore(1000, '\t');
		}

		is.get(authorName, 256);

		if (is) {
			m_authorName = new char[strLen(authorName) + 1];
			strCpy(m_authorName, authorName);
		}

		return is;
	}
	void Book::set(int member_id) {
		Publication::set(member_id);
		Publication::resetDate();
	}
	Book::operator bool() const {
		return m_authorName and Publication::operator bool();
	}
}