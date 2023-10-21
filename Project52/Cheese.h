#ifndef SDDS_CHEESE_H
#define SDDS_CHEESE_H

#include <iostream>
#include <string>
#include <vector>

namespace sdds {
    class Cheese {
        friend std::ostream& operator<<(std::ostream& os, const Cheese& cheese);

    private:
        std::string name{ "NaC" };
        int weight{ 0 };
        float price{ 0.0 };
        std::string features;

        void extractFeatures(const std::string& featuresStr);
        std::string trim(const std::string& str);
        std::string join(const std::vector<std::string>& vec, char delimiter);

    public:
        Cheese();
        Cheese(const std::string& str);
        int getWeight() const;
        Cheese operator<=(const Cheese& ch);
        Cheese slice(int weight);
    };
}

#endif
