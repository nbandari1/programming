
#ifndef SDDS_CHEESESHOP_H
#define SDDS_CHEESESHOP_H

#include <iostream>
#include "Cheese.h"

namespace sdds {
	class CheeseShop {
		std::string m_name;
		const Cheese** m_array;
		size_t m_count;
		size_t m_capacity;
		void copy(const CheeseShop& src);
		void move(CheeseShop&& src) noexcept;
		void clear();
		void resize();

	public:
		CheeseShop(const std::string& name = "No Name");
		CheeseShop(const CheeseShop& src);
		CheeseShop& operator=(const CheeseShop& src);
		CheeseShop(CheeseShop&& src) noexcept;
		CheeseShop& operator=(CheeseShop&& src) noexcept;
		~CheeseShop();

		CheeseShop& addCheese(const Cheese& cheese);
		friend std::ostream& operator<<(std::ostream& os, const CheeseShop& shop);
	};
	
}
#endif
