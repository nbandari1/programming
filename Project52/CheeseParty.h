#ifndef SDDS_CHEESEPARTY_H
#define SDDS_CHEESEPARTY_H

#include "Cheese.h"

namespace sdds {
	class CheeseParty {
		const Cheese** m_array;
		size_t m_count;
		size_t m_capacity;
		void resize();

	public:
		CheeseParty();
		~CheeseParty();
		CheeseParty(const CheeseParty& other); 
		CheeseParty& operator=(const CheeseParty& other);

		CheeseParty(CheeseParty&& other) noexcept; 
		CheeseParty& operator=(CheeseParty&& other) noexcept;

		CheeseParty& addCheese(const Cheese& cheese);
		CheeseParty& removeCheese();
		friend std::ostream& operator<<(std::ostream& os, const CheeseParty& party);
	};
}
#endif
