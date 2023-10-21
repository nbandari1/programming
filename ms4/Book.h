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

#ifndef SDDS_BOOK_H
#define SDDS_BOOK_H

#include "Publication.h"

namespace sdds {
    class Book : public Publication {
    private:
        char* m_authorName;
    public:
        Book();
        ~Book();
        Book(const Book& book);
        Book& operator=(const Book& book);
        void setBookEmpty();
        char type() const;
        std::ostream& write(std::ostream& os) const;
        std::istream& read(std::istream& is);
        virtual void set(int member_id);
        operator bool() const;
    };
}
#endif
