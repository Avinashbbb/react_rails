namespace :quickbooks do

  namespace :import do

    desc 'import payment_methods from Quickbooks'
    task payment_methods: :environment do
      STDOUT.puts 'WARNING: This task is meant to initialize the portal. Running it against existing data would be HARMFUL.'
      STDOUT.puts "Are you sure you want to continue ? (Y/n)"
      input = STDIN.gets.strip.downcase

      if input == 'y'
        adapter = AccountingAdapter::Adapter.new

        payment_methods_result = adapter.payment_methods
        if payment_methods_result && payment_methods_result['QueryResponse']['PaymentMethod'] && payment_methods_result['QueryResponse']['PaymentMethod'].size > 0
          payment_methods_result['QueryResponse']['PaymentMethod'].each do |payment_method|
            if payment_method["Active"]
              payment_method1 = AccountingAdapter::PaymentMethod.where(name: payment_method["Name"]).first

              if payment_method1
                payment_method1.update!(payment_type: payment_method["Type"],
                                        qb_id: payment_method["Id"],
                                        qb_sync_token: payment_method["SyncToken"])
              else
                AccountingAdapter::PaymentMethod.create!(name: payment_method["Name"],
                                                         payment_type: payment_method["Type"],
                                                         qb_id: payment_method["Id"],
                                                         qb_sync_token: payment_method["SyncToken"])
              end
            end
          end
        end
      end

    end
  end
end