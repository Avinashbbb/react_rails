# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
Rails.application.config.assets.precompile += %w( devise.css
                                                  mail.css
                                                  accounting_adapter/script.js
                                                  accounting_adapter/jquery.payform.min.js
                                                  specimen_cheque.png
                                                  visa.jpg
                                                  mastercard.jpg
                                                  mailer/PM-Entete-Acceptation_fr.png
                                                  mailer/PM-Entete-Acceptation_en.png
                                                  mailer/PM-Entete-Rappel_en.png
                                                  mailer/PM-Entete-Rappel_fr.png
                                                  mailer/PM-Icone-Facebook.png
                                                  mailer/PM-Icone-LinkedIn.png
                                                  mailer/PM-Icone-SiteWeb.png
                                                  mailer/logo_parfaitmenage_coul_full_fr.png
)
