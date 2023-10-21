#include "CheeseShop.h"

namespace sdds {
    CheeseShop::CheeseShop(const std::string& name)
        : m_name(name), m_array(nullptr), m_count(0), m_capacity(0)
    {}

    CheeseShop::CheeseShop(const CheeseShop& src) {
        copy(src);
    }

    CheeseShop& CheeseShop::operator=(const CheeseShop& src) {
        if (this != &src) {
            clear();
            copy(src);
        }
        return *this;
    }

    CheeseShop::CheeseShop(CheeseShop&& src) noexcept {
        move(std::move(src));
    }

    CheeseShop& CheeseShop::operator=(CheeseShop&& src) noexcept {
        if (this != &src) {
            clear();
            move(std::move(src));
        }
        return *this;
    }

    CheeseShop::~CheeseShop() {
        clear();
    }

    CheeseShop& CheeseShop::addCheese(const Cheese& cheese) {
        if (m_count == m_capacity) {
            resize();
        }

        m_array[m_count++] = new Cheese(cheese);

        return *this;
    }

    void CheeseShop::resize() {
        m_capacity += 5;  // You can adjust the resizing strategy based on your needs

        const Cheese** temp = new const Cheese * [m_capacity];

        for (size_t i = 0; i < m_count; ++i) {
            temp[i] = m_array[i];
        }

        delete[] m_array;
        m_array = temp;
    }

    std::ostream& operator<<(std::ostream& os, const CheeseShop& shop) {
        os << "--------------------------\n";
        os << shop.m_name << "\n";
        os << "--------------------------\n";

        if (shop.m_count == 0) {
            os << "This shop is out of cheese!\n";
        }
        else {
            for (size_t i = 0; i < shop.m_count; ++i) {
                os << *shop.m_array[i];
            }
        }

        os << "--------------------------\n";

        return os;
    }

    void CheeseShop::clear() {
        for (size_t i = 0; i < m_count; ++i) {
            delete m_array[i];
        }

        delete[] m_array;
        m_array = nullptr;
        m_count = 0;
        m_capacity = 0;
    }

    void CheeseShop::copy(const CheeseShop& src) {
        m_name = src.m_name;
        m_count = src.m_count;
        m_capacity = src.m_capacity;

        m_array = new const Cheese * [m_capacity];

        for (size_t i = 0; i < m_count; ++i) {
            m_array[i] = new Cheese(*(src.m_array[i]));
        }
    }

    void CheeseShop::move(CheeseShop&& src) noexcept {
        m_name = std::move(src.m_name);
        m_array = src.m_array;
        m_count = src.m_count;
        m_capacity = src.m_capacity;

        src.m_array = nullptr;
        src.m_count = 0;
        src.m_capacity = 0;
    }
}