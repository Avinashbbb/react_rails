FactoryBot.define do
  factory :phone, class: Client::Phone do
    trait :home do
      phone_type {CONSTANTS::PHONES::HOME}
    end

    trait :work do
      phone_type {CONSTANTS::PHONES::WORK}
    end
  end
end
