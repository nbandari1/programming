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

#ifndef SDDS_PUBLICATION_H
#define SDDS_PUBLICATION_H
#define _CRT_SECURE_NO_WARNINGS

#include "Date.h"
#include "Streamable.h"
#include "Lib.h"

namespace sdds {
    class Publication : public Streamable {
    private:
        char* m_title;
        char m_shelfId[SDDS_SHELF_ID_LEN + 1];
        int m_membership;
        int m_libRef;
        Date m_date;
    public:
        Publication();
        ~Publication();
        Publication(const Publication& publication);
        Publication& operator=(const Publication& publication);
        void setDefault();
        virtual void set(int member_id);
        void setRef(int value);
        void resetDate();
        virtual char type() const;
        bool onLoan() const;
        Date checkoutDate() const;
        bool operator==(const char* title) const;
        operator const char* () const;
        int getRef() const;
        bool conIO(std::ios& io) const;
        std::ostream& write(std::ostream& os) const;
        std::istream& read(std::istream& is);
        operator bool() const;
    };
}
#endif

