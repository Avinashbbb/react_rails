AccountingAdapter.configure do |config|
  config.adapter = :quickbooks
  config.payment_adapters = {
      credit: 'paysafe',
      ppa: 'desjardins_ppa'
  }
  config.deposit_adapters = {
    drd: 'desjardins_depot_direct'
  }
end
