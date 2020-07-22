// Setup for tests
import '/imports/core/lib/test/server/lib.test.js';
import '/imports/core/lib/server/serverTestSetup.test.js';
import '/imports/core/lib/testInit.test.js';
// Server only tests
import '/imports/core/api/RESTAPI/server/endpoints/zipLoan/test/FilesBinPacker.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/zipLoan/test/zipLoan.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/addLoanNote.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/addProUserToProperty.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/deleteFile.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/getProperty.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/getPropertyLoans.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/getUser.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/insertProperty.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/interestRates.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/inviteCustomerToProProperties.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/inviteUserToPromotion.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/mortgageEstimate.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/referCustomer.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/setPropertyUserPermissions.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/testEndpoint.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/updateProperty.test.js';
import '/imports/core/api/RESTAPI/server/endpoints/test/uploadFile.test.js';
import '/imports/core/api/RESTAPI/server/test/RESTAPI.test.js';
import '/imports/core/api/RESTAPI/server/test/apiTestHelpers.test.js';
import '/imports/core/components/LoanChecklist/LoanChecklistEmail/test/server/LoanChecklistEmail.test.js';
import '/imports/core/api/activities/server/test/adminCreateUserListener.test.js';
import '/imports/core/api/activities/server/test/anonymousCreateUserListener.test.js';
import '/imports/core/api/activities/server/test/assignAdminToUserListener.test.js';
import '/imports/core/api/activities/server/test/loanSetDisbursementDateListener.test.js';
import '/imports/core/api/activities/server/test/proInviteUserListener.test.js';
import '/imports/core/api/activities/server/test/sendEmailListener.test.js';
import '/imports/core/api/activities/server/test/setUserReferredByListener.test.js';
import '/imports/core/api/activities/server/test/setUserReferredByOrganisationListener.test.js';
import '/imports/core/api/activities/server/test/toggleAccountListener.test.js';
import '/imports/core/api/activities/server/test/userPasswordResetListener.test.js';
import '/imports/core/api/activities/server/test/userVerifyEmailListener.test.js';
import '/imports/core/api/analytics/server/test/Analytics.test.js';
import '/imports/core/api/borrowers/server/test/BorrowerService.test.js';
import '/imports/core/api/checklists/server/test/ChecklistService.test.js';
import '/imports/core/api/commissionRates/server/test/CommissionRateService.test.js';
import '/imports/core/api/cron/server/test/CronitorService.test.js';
import '/imports/core/api/drip/server/test/DripService.test.js';
import '/imports/core/api/email/server/test/EmailService.test.js';
import '/imports/core/api/email/server/test/MailchimpService.test.js';
import '/imports/core/api/email/server/test/accountsEmails.test.js';
import '/imports/core/api/email/server/test/emailConfigs.test.js';
import '/imports/core/api/email/server/test/emailSetup.test.js';
import '/imports/core/api/events/server/test/EventService.test.js';
import '/imports/core/api/factories/test/server/factoriesHelpers.test.js';
import '/imports/core/api/files/server/test/FileService.test.js';
import '/imports/core/api/files/server/test/S3Service.test.js';
import '/imports/core/api/front/server/test/FrontService.test.js';
import '/imports/core/api/gpsStats/server/test/gpsStats.test.js';
import '/imports/core/api/helpers/server/test/CollectionService.test.js';
import '/imports/core/api/helpers/server/test/collectionHelpers.test.js';
import '/imports/core/api/helpers/server/test/collectionServerHelpers.test.js';
import '/imports/core/api/helpers/server/test/methodServerHelpers.test.js';
import '/imports/core/api/insuranceRequests/server/test/InsuranceRequestService.test.js';
import '/imports/core/api/insurances/server/test/InsuranceService.test.js';
import '/imports/core/api/intercom/server/test/IntercomService.test.js';
import '/imports/core/api/interestRates/server/test/InterestRatesService.test.js';
import '/imports/core/api/interestRates/server/test/currentInterestRates.test.js';
import '/imports/core/api/irs10y/server/test/Irs10yService.test.js';
import '/imports/core/api/lenderRules/server/test/LenderRulesService.test.js';
import '/imports/core/api/lenderRules/server/test/helpers.spec.js';
import '/imports/core/api/lenders/server/test/LenderService.test.js';
import '/imports/core/api/loans/server/test/LoanService.test.js';
import '/imports/core/api/loans/server/test/proLoans.test.js';
import '/imports/core/api/loans/server/test/proPropertyLoans.test.js';
import '/imports/core/api/lots/server/test/LotService.test.js';
import '/imports/core/api/methods/server/test/methods.test.js';
import '/imports/core/api/migrations/server/test/1.test.js';
import '/imports/core/api/migrations/server/test/11.test.js';
import '/imports/core/api/migrations/server/test/12.test.js';
import '/imports/core/api/migrations/server/test/13.test.js';
import '/imports/core/api/migrations/server/test/14.test.js';
import '/imports/core/api/migrations/server/test/15.test.js';
import '/imports/core/api/migrations/server/test/16.test.js';
import '/imports/core/api/migrations/server/test/17.test.js';
import '/imports/core/api/migrations/server/test/20.test.js';
import '/imports/core/api/migrations/server/test/21.test.js';
import '/imports/core/api/migrations/server/test/22.test.js';
import '/imports/core/api/migrations/server/test/23.test.js';
import '/imports/core/api/migrations/server/test/24.test.js';
import '/imports/core/api/migrations/server/test/26.test.js';
import '/imports/core/api/migrations/server/test/27.test.js';
import '/imports/core/api/migrations/server/test/28.test.js';
import '/imports/core/api/migrations/server/test/29.test.js';
import '/imports/core/api/migrations/server/test/3.test.js';
import '/imports/core/api/migrations/server/test/30.test.js';
import '/imports/core/api/migrations/server/test/33.test.js';
import '/imports/core/api/migrations/server/test/34.test.js';
import '/imports/core/api/migrations/server/test/35.test.js';
import '/imports/core/api/migrations/server/test/36.test.js';
import '/imports/core/api/migrations/server/test/37.test.js';
import '/imports/core/api/migrations/server/test/38.test.js';
import '/imports/core/api/migrations/server/test/39.test.js';
import '/imports/core/api/migrations/server/test/4.test.js';
import '/imports/core/api/migrations/server/test/40.test.js';
import '/imports/core/api/migrations/server/test/5.test.js';
import '/imports/core/api/migrations/server/test/6.test.js';
import '/imports/core/api/migrations/server/test/7.test.js';
import '/imports/core/api/migrations/server/test/8.test.js';
import '/imports/core/api/migrations/server/test/9.test.js';
import '/imports/core/api/monitoring/server/test/monitoring.test.js';
import '/imports/core/api/mortgageNotes/server/test/MortgageNoteService.test.js';
import '/imports/core/api/notifications/server/test/NotificationService.test.js';
import '/imports/core/api/offers/server/test/OfferService.test.js';
import '/imports/core/api/organisations/server/test/OrganisationService.test.js';
import '/imports/core/api/organisations/server/test/testHelpers.test.js';
import '/imports/core/api/pdf/server/test/PDFService.test.js';
import '/imports/core/api/promotionLots/server/test/PromotionLotService.test.js';
import '/imports/core/api/promotionOptions/server/test/PromotionOptionService.test.js';
import '/imports/core/api/promotions/server/test/PromotionService.test.js';
import '/imports/core/api/promotions/server/test/promotionServerHelpers.test.js';
import '/imports/core/api/properties/server/test/PropertyService.test.js';
import '/imports/core/api/reducers/server/test/assigneeReducer.test.js';
import '/imports/core/api/revenues/server/test/RevenueService.test.js';
import '/imports/core/api/security/server/test/SecurityService.test.js';
import '/imports/core/api/security/server/test/collectionSecurity.test.js';
import '/imports/core/api/sessions/server/test/SessionService.test.js';
import '/imports/core/api/slack/server/test/SlackService.test.js';
import '/imports/core/api/tasks/server/test/TaskService.test.js';
import '/imports/core/api/updateWatchers/server/test/UpdateWatcherService.test.js';
import '/imports/core/api/users/server/test/AssigneeService.test.js';
import '/imports/core/api/users/server/test/UserService.test.js';
import '/imports/core/api/users/server/test/resolvers.test.js';
import '/imports/core/api/users/server/test/roles.test.js';
