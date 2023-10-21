
#include "CheeseParty.h"

namespace sdds {
    CheeseParty::CheeseParty()
        : m_array(nullptr), m_count(0), m_capacity(0)
    {}

    CheeseParty::~CheeseParty() {
        delete[] m_array;
    }

    // Copy constructor
    CheeseParty::CheeseParty(const CheeseParty& other)
        : m_array(nullptr), m_count(0), m_capacity(0) {
        *this = other; // Reuse copy assignment operator
    }

    // Copy assignment operator
    CheeseParty& CheeseParty::operator=(const CheeseParty& other) {
        if (this != &other) {
            delete[] m_array;

            m_count = other.m_count;
            m_capacity = other.m_capacity;

            m_array = new const Cheese * [m_capacity];

            for (size_t i = 0; i < m_count; ++i) {
                m_array[i] = other.m_array[i];
            }
        }
        return *this;
    }

    // Move constructor
    CheeseParty::CheeseParty(CheeseParty&& other) noexcept
        : m_array(other.m_array), m_count(other.m_count), m_capacity
        (other.m_capacity) {
        other.m_array = nullptr;
        other.m_count = 0;
        other.m_capacity = 0;
    }

    // Move assignment operator
    CheeseParty& CheeseParty::operator=(CheeseParty&& other) noexcept {
        if (this != &other) {
            delete[] m_array;

            m_array = other.m_array;
            m_count = other.m_count;
            m_capacity = other.m_capacity;

            other.m_array = nullptr;
            other.m_count = 0;
            other.m_capacity = 0;
        }
        return *this;
    }

    CheeseParty& CheeseParty::addCheese(const Cheese& cheese) {
        // Check if the cheese is already in the array
        for (size_t i = 0; i < m_count; ++i) {
            if (m_array[i] == &cheese) {
                return *this; // Cheese already in the party
            }
        }

        // Resize the array if necessary
        if (m_count == m_capacity) {
            resize();
        }

        // Add the cheese to the array
        m_array[m_count++] = &cheese;

        return *this;
    }

    CheeseParty& CheeseParty::removeCheese() {
        for (size_t i = 0; i < m_count; ++i) {
            if (m_array[i]->getWeight() == 0) {
                // Remove cheese with 0 weight
                m_array[i] = nullptr;
            }
        }

        // Compact the array by removing nullptrs
        size_t validCheeseCount = 0;
        for (size_t i = 0; i < m_count; ++i) {
            if (m_array[i] != nullptr) {
                m_array[validCheeseCount++] = m_array[i];
            }
        }

        m_count = validCheeseCount;

        return *this;
    }

    void CheeseParty::resize() {
        m_capacity += 5;  // You can adjust the resizing strategy based on your needs

        const Cheese** temp = new const Cheese * [m_capacity];

        for (size_t i = 0; i < m_count; ++i) {
            temp[i] = m_array[i];
        }

        delete[] m_array;
        m_array = temp;
    }

    std::ostream& operator<<(std::ostream& os, const CheeseParty& party) {
        os << "--------------------------\n";
        os << "Cheese Party\n";
        os << "--------------------------\n";

        if (party.m_count == 0) {
            os << "This party is just getting started!\n";
        }
        else {
            for (size_t i = 0; i < party.m_count; ++i) {
                os << *party.m_array[i];
            }
        }

        os << "--------------------------\n";

        return os;
    }
}