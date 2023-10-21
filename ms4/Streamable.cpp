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

#include "Streamable.h"

namespace sdds {
    Streamable::~Streamable() {
            //..
    };
    std::ostream& operator<<(std::ostream& os, const Streamable& s) {
        if (s) {
            s.write(os);
        }
        return os;
    }
    std::istream& operator>>(std::istream& is, Streamable& s) {
        return (s.read(is));
    }
}