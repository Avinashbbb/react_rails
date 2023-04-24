require 'csv'
require 'franchises/tree'

module Jobs
  class Recurrences

    WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

    def initialize(franchise, csv_file_path)
      @franchise = ::Franchises::Tree.new.franchise_and_descendants_list.select { |f| f[:name].strip.upcase == franchise.strip.upcase }.first
      @error_file_path = "#{Rails.root}/private/errors/#{@franchise[:name].gsub(/\W+/, '').underscore}_#{Time.now.to_i}.log"
      @csv_file_path = csv_file_path

      user = User.find_or_initialize_by(email: @franchise[:email], opportunist_id: @franchise[:id].to_i)

      if user.new_record?
        user.name = @franchise[:name]
        user.password = 'Optigo!2020'
        user.password_confirmation = 'Optigo!2020'
        user.roles << Role.find_by(name: "franchise_#{@franchise[:kind].downcase}")
        user.save!
      end

      @unit = Optigo::Unit.find_or_create_by(user: user, name: @franchise[:name], franchise_id: @franchise[:id].to_i)
    end

    def seed
      CSV.foreach(@csv_file_path, col_sep: ";", headers: true, header_converters: lambda { |h| h.gsub('Client - ', '').gsub('Information - ', '').gsub(/\s/, '_').underscore }) do |row|
        row_hash = row.to_hash.map { |k, v| {k => v.try(:strip)} }.reduce(&:merge)

        begin
          customer = Optigo::Customer.find_by(name: row_hash["nom"].strip, opportunist_id: @franchise[:id].to_i)
          service_type = row_hash["type_de_ménage"] || row_hash["service"]
          customer_item = customer.contracts.find_by(vocation: "QUOTE").customer_items.detect { |i| i[:name].upcase.include?(service_type.upcase) }
          location = customer.locations.first
          job_template = Optigo::JobTemplate.first # menage

          frequency = row_hash["fréquence"] || row_hash["frequency"]
          interval = frequency.match(/(?<interval>\d+)/)[:interval].to_i rescue 1
          next_job_date = row_hash["prochain_rendez_vous"] || row_hash["rendez_vous"]
          start_date = next_job_date ? Date.parse(next_job_date) : Date.strptime(row_hash["prochain_ménage"], '%m/%d/%y')
          day = WEEKDAYS[start_date.wday]

          job = {
              job_template_id: job_template.id,
              customer_location_id: location.id,
              start_date: start_date,
              unit_id: @unit.id,
              recurrence: {
                  interval: interval,
                  type: "weekly",
                  days: [day]
              },
              customer_item_id: customer_item.id
          }

          Optigo::Job.create_and_assign(customer_item, job)
        rescue => e
          File.open(@error_file_path, "a+") do |f|
            f.write("error for client #{row_hash["nom"]}\n")
            f.write("#{e.message}\n")
            f.write(e.backtrace.join("\n"))
            f.write("\n\n")
          end
        end

      end

    end
  end
end
