FactoryBot.define do
  factory :item_kind, class: Optigo::ItemKind do
    trait(:container) {
      name {'Container'}
    }

    trait(:truck) {
      name {'Truck'}
    }
  end
end
