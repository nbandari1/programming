#include "Cheese.h"
#include <sstream>
#include <iomanip>

namespace sdds {
    void Cheese::extractFeatures(const std::string& featuresStr) {
        std::istringstream iss(featuresStr);
        std::vector<std::string> featureList;
        std::string feature;

        while (std::getline(iss, feature, ',')) {
            // Trim leading and trailing spaces from each feature
            featureList.push_back(trim(feature));
        }

        // Join features into a space-separated string
        features = join(featureList, ' ');
    }

    std::string Cheese::trim(const std::string& str) {
        size_t first = str.find_first_not_of(' ');
        size_t last = str.find_last_not_of(' ');

        if (first == std::string::npos || last == std::string::npos)
            return "";

        return str.substr(first, last - first + 1);
    }

    std::string Cheese::join(const std::vector<std::string>& vec, char delimiter) {
        std::string result;
        for (const auto& s : vec) {
            result += s;
            result += delimiter;
        }
        if (!result.empty()) {
            result.pop_back(); // Remove the trailing delimiter
        }
        return result;
    }

    Cheese::Cheese()
        : name{ "NaC" }, weight{ 0 }, price{ 0.0 }, features{ "" }
    {}

    Cheese::Cheese(const std::string& str) {
        std::istringstream iss(str);
        std::string temp;
        std::getline(iss, name, ',');
        std::getline(iss, temp, ',');
        weight = std::stoi(temp);
        std::getline(iss, temp, ',');
        price = std::stof(temp);
        std::getline(iss, features);
        name = trim(name);
        features = trim(features);
        extractFeatures(features);
    }

    int Cheese::getWeight() const {
        return weight;
    }

    Cheese Cheese::operator<=(const Cheese& ch) {
        if (weight <= ch.weight) {
            return Cheese(ch.name + "," + std::to_string(ch.weight) + "," + std::to_string(ch.price) + "," + ch.features);
        }
        else {
            return Cheese();
        }
    }

    Cheese Cheese::slice(int weight) {
        if (this->weight >= weight) {
            int* w = &(this->weight);
            *w -= weight;
            return Cheese(name + "," + std::to_string(weight) + "," + std::to_string(price) + "," + features);
        }
        else {
            return Cheese();
        }
    }

    std::ostream& operator<<(std::ostream& os, const Cheese& cheese) {
        os << std::fixed << std::setprecision(2) << std::setw(1) << "|"
            << std::left << std::setw(21) << cheese.name << std::setw(1) << "|"
            << std::setw(5) << cheese.weight << std::setw(1) << "|"
            << std::setw(5) << cheese.price << std::setw(1) << "|"
            << std::right << std::setw(33) << cheese.features << std::setw(2) << "|" << std::endl;
        return os;
    }
}