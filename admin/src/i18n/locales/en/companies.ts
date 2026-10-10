/** Companies page, company cards, lines table, and line/company modals (EN). */
export default {
  'companies.title': 'Transit Operators & Lines',
  'companies.subtitle':
    'Manage transport authorities, official domains, and their assigned bus lines catalog.',
  'companies.searchCompanies': 'Search companies...',
  'companies.searchLines': 'Search bus lines...',
  'companies.addBusLine': 'Add Bus Line',
  'companies.addBusLineTitle': 'Add a new bus line to an operator lines catalog',
  'companies.addCompany': 'Add Company',
  'companies.tabCompanies': 'Transit Companies ({count})',
  'companies.tabLines': 'Operating Bus Lines ({count})',
  'companies.deleteConfirm': "Are you sure you want to delete company node '{id}'?",
  'companies.deleteSuccess': 'Removed operator node {id}',
  'companies.deleteError': 'Failed to delete operator',
  'companies.paymentConfirm': "Confirm payment received for '{id}' and activate its subscription?",
  'companies.paymentActivated': 'Subscription activated for {id}',
  'companies.paymentError': 'Failed to activate subscription',

  // Grid view / empty state
  'companies.noOperators': 'No operators found',
  'companies.noOperatorsHint': 'Try refining your search query or add a new transit authority.',
  'companies.addOperator': 'Add Transit Operator',

  // Company card
  'companies.duplicateNode': 'Duplicate Node',
  'companies.idLabel': 'ID: {id}',
  'companies.deleteCompanyTitle': 'Delete Company Node',
  'companies.busLines': 'Bus Lines',
  'companies.registeredBuses': 'Registered Buses',
  'companies.subscription': 'Subscription',
  'companies.active': 'Active',
  'companies.noPlan': 'No Plan',
  'companies.staffDomain': 'Staff Domain:',
  'companies.confirmPayment': 'Confirm Payment & Activate',
  'companies.confirmPaymentTitle':
    'Confirm received payment (bank transfer / Vodafone Cash) and activate',
  'companies.manageLines': 'Manage Lines ({count})',

  // Lines table view
  'companies.allLinesCatalog': 'All Operating Lines Catalog ({count})',
  'companies.linesAcrossCompanies': 'Showing lines across all registered transport companies',
  'companies.colLineIdentifier': 'Line Name / Identifier',
  'companies.colAssignedOperator': 'Assigned Operator',
  'companies.colConfiguredRoutes': 'Configured Routes',
  'companies.colActions': 'Actions',
  'companies.noLines': 'No bus lines found.',
  'companies.clickToRegister': 'Click here to register one.',
  'companies.terminalRouteOne': '{count} terminal route',
  'companies.terminalRoutesMany': '{count} terminal routes',
  'companies.renameLineTitle': 'Rename bus line',
  'companies.deleteLineTitle': 'Delete bus line',

  // Add company modal
  'companies.addOperatorModal': 'Add Transit Operator',
  'companies.addOperatorSubtitle':
    'Register a new public transport authority, university shuttle, or private carrier.',
  'companies.slugLabel': 'Company Slug / ID',
  'companies.slugPlaceholder': 'e.g. ecu-shuttle, cta, or super-jet',
  'companies.displayName': 'Display Name',
  'companies.displayNamePlaceholder': 'e.g. ECU Transit Shuttles',
  'companies.domainLabel': 'Staff Email Domain (Optional)',
  'companies.domainPlaceholder': 'e.g. ecu.edu.eg or cta.eg',
  'companies.domainHint': 'Drivers or admins signing up with this domain will be linked automatically.',
  'companies.idNameRequired': 'Company ID and Name are required.',
  'companies.operatorCreated': 'Operator {name} created.',
  'companies.createError': 'Failed to create company.',
  'companies.createOperator': 'Create Operator',

  // Add bus line modal
  'companies.addBusLineModal': 'Add New Bus Line',
  'companies.addBusLineSubtitle':
    "Register a new transit route identifier into the company's official busLines list.",
  'companies.transitOperator': 'Transit Operator',
  'companies.lineIdentifierLabel': 'Bus Line Identifier / Name',
  'companies.lineIdentifierPlaceholder': 'e.g. Line 115, M554, Airport Express, BRT-1',
  'companies.lineCatalogHint':
    "This adds the route to the operator's official line catalog without requiring terminal coordinates.",
  'companies.enterLineName': 'Please enter a bus line name.',
  'companies.lineExists': 'Line "{line}" already exists for {company}.',
  'companies.lineAdded': 'Added bus line "{line}" to {company}',
  'companies.addLineError': 'Failed to add bus line.',

  // Line manager modal
  'companies.linesCrudTitle': 'Bus Lines CRUD - {name}',
  'companies.linesCrudSubtitle': 'Add new routes, rename existing lines across all buses, or remove lines.',
  'companies.newLinePlaceholder': 'Enter new line name (e.g. Line 5 or Airport Express)',
  'companies.addLine': 'Add Line',
  'companies.lineExistsOperator': 'This bus line already exists for this operator.',
  'companies.lineAddedTo': 'Added line "{line}" to {name}',
  'companies.addLineErrorShort': 'Failed to add line',
  'companies.lineRenamed': 'Renamed line "{old}" to "{new}" and updated buses.',
  'companies.renameError': 'Failed to rename line',
  'companies.deleteLineConfirm': 'Are you sure you want to delete bus line "{line}"?',
  'companies.lineDeleted': 'Deleted line "{line}"',
  'companies.deleteLineError': 'Failed to delete line',
  'companies.noLinesYet': 'No lines configured yet.',
  'companies.confirmRenameTitle': 'Confirm Rename',
  'companies.cancelTitle': 'Cancel',
  'companies.renameAcrossBuses': 'Rename Line across all buses',
  'companies.deleteLineAction': 'Delete Line',

  // Line operations hook
  'companies.renameLineSuccess': 'Renamed line "{old}" to "{new}"',
  'companies.renameLineError': 'Failed to rename line',
  'companies.deleteLineConfirmCompany': 'Delete bus line "{line}" from {company}?',
  'companies.deleteBusLineSuccess': 'Deleted bus line "{line}"',
  'companies.deleteBusLineError': 'Failed to delete bus line',
};
