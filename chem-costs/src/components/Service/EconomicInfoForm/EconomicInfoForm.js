import { useEffect, useState } from 'react';
import Input from '../../Form/Input/Input';
import Slider from '../../Form/Slider/Slider';
import SubmitButton from '../../Form/SubmitButton/SubmitButton';
import styles from '../../Project/ProjectForm/ProjectForm.module.css';

function EconomicInfoForm({ handleSubmit, txtBtn, projectData }) {

    const [economicInfo, setEconomicInfo] = useState({});

    // Initialize economicInfo with default values
    useEffect(() => {
        const defaults = {};

        [
            ...inputFields,
            ...sliderFieldsDirectCosts,
            ...sliderFieldsIndirectCosts,
            ...sliderFieldsProductionCosts,
            ...sliderFieldsGeneralExpenditures
        ].forEach(field => {
            defaults[field.name] = field.defaultValue || 0;
        });

        setEconomicInfo(defaults);
    }, []);

    // define submit function
    function submit (e) {
        e.preventDefault();
        const updatedProject = { ...projectData };
        updatedProject.general_info = {};

        // Map input fields to the project general_info
        inputFields.forEach(field => {
            updatedProject.general_info[field.name] = economicInfo[field.name] || '';
        });

        // Map slider fields to the project capex and product_cost
        updatedProject.capex = {};
        const directCosts = {};
        sliderFieldsDirectCosts.forEach(field => {
            directCosts[field.name] = economicInfo[field.name] || field.defaultValue;
        });
        updatedProject.capex.direct_costs = directCosts;

        const indirectCosts = {};
        sliderFieldsIndirectCosts.forEach(field => {
            indirectCosts[field.name] = economicInfo[field.name] || field.defaultValue;
        });
        updatedProject.capex.indirect_costs = indirectCosts;

        updatedProject.product_cost = {};
        const productionCosts = {};
        sliderFieldsProductionCosts.forEach(field => {
            productionCosts[field.name] = economicInfo[field.name] || field.defaultValue;
        });
        updatedProject.product_cost.production_costs = productionCosts;

        const generalExpenditures = {};
        sliderFieldsGeneralExpenditures.forEach(field => {
            generalExpenditures[field.name] = economicInfo[field.name] || field.defaultValue;
        });
        updatedProject.product_cost.general_expenditures = generalExpenditures;
        
        // Call the handleSubmit function with the updated project
        handleSubmit(updatedProject);

    }

    // handle change function
    function handleOnChange(e) {
        setEconomicInfo({
            ...economicInfo,
            [e.target.name]: e.target.value
        });
        console.log('Updated economicInfo:', economicInfo);
    }

    // Define input and slider configs
    const inputFields = [
        {
            type: 'number',
            text: 'Total Equipment Cost (million USD)',
            name: 'total_equipment_cost',
            placeholder: 'Enter total equipment cost in million USD',
            required: true
        },
        {
            type: 'number',
            text: 'Total Utility Cost (million USD per year)',
            name: 'total_utility_cost',
            placeholder: 'Enter total utility cost in million USD per year',
            required: true
        },
        {
            type: 'number',
            text: 'Product Selling Price (USD / kg)',
            name: 'product_selling_price',
            placeholder: 'Enter product selling price in USD per kg',
            required: true
        }
    ];

    // Helper to get default value from projectData or fallback
    const getDefaultValue = (section, fieldName, fallback) => {
        if (section === 'general_info') {
            return projectData?.general_info?.[fieldName] ?? fallback;
        }
        if (section === 'capex.direct_costs') {
            return projectData?.capex?.direct_costs?.[fieldName] ?? fallback;
        }
        if (section === 'capex.indirect_costs') {
            return projectData?.capex?.indirect_costs?.[fieldName] ?? fallback;
        }
        if (section === 'product_cost.production_costs') {
            return projectData?.product_cost?.production_costs?.[fieldName] ?? fallback;
        }
        if (section === 'product_cost.general_expenditures') {
            return projectData?.product_cost?.general_expenditures?.[fieldName] ?? fallback;
        }
        return fallback;
    };

    const sliderFieldsDirectCosts = [
        {
            label: 'Working Capital Cost (% over Total Capital Investiment)',
            name: 'working_capital_cost',
            min: 10,
            max: 20,
            step: 5,
            defaultValue: getDefaultValue('capex.direct_costs', 'working_capital_cost', 10),
        },
        {
            label: 'Insulation and Painting Cost (% over Total Equipment Cost)',
            name: 'insulation_and_painting_cost',
            min: 25,
            max: 55,
            step: 5,
            defaultValue: getDefaultValue('capex.direct_costs', 'insulation_and_painting_cost', 30),
        },
        {
            label: 'Instrumentation and Control Cost (% over Total Equipment Cost)',
            name: 'instrumentation_and_control_cost',
            min: 6,
            max: 30,
            step: 1,
            defaultValue: getDefaultValue('capex.direct_costs', 'instrumentation_and_control_cost', 20),
        },
        {
            label: 'Piping Cost (% over Total Equipment Cost)',
            name: 'piping_cost',
            min: 10,
            max: 80,
            step: 5,
            defaultValue: getDefaultValue('capex.direct_costs', 'piping_cost', 35),
        },
        {
            label: 'Electrical System Cost (% over Total Equipment Cost)',
            name: 'electrical_system_cost',
            min: 10,
            max: 40,
            step: 5,
            defaultValue: getDefaultValue('capex.direct_costs', 'electrical_system_cost', 20),
        },
        {
            label: 'Construction, Process and Auxiliaries Cost (% over Total Equipment Cost)',
            name: 'construction_process_auxiliaries_cost',
            min: 10,
            max: 70,
            step: 5,
            defaultValue: getDefaultValue('capex.direct_costs', 'construction_process_auxiliaries_cost', 30),
        },
        {
            label: 'Installation of Services and Improvements Cost (% over Total Equipment Cost)',
            name: 'installation_services_improvements_cost',
            min: 40,
            max: 100,
            step: 5,
            defaultValue: getDefaultValue('capex.direct_costs', 'installation_services_improvements_cost', 50),
        },
        {
            label: 'Land Cost (% over Total Equipment Cost)',
            name: 'land_cost',
            min: 0,
            max: 8,
            step: 1,
            defaultValue: getDefaultValue('capex.direct_costs', 'land_cost', 0),
        }
    ];

    const sliderFieldsIndirectCosts = [
        {
            label: 'Engineering and Supervision Cost (% over Total Direct Costs)',
            name: 'engineering_supervision_cost',
            min: 5,
            max: 30,
            step: 5,
            defaultValue: getDefaultValue('capex.indirect_costs', 'engineering_supervision_cost', 15),
        },
        {
            label: 'Construction Expenditures and Contractors Fees (% over Total Direct Costs)',
            name: 'construction_expenditures_contractors_fees',
            min: 6,
            max: 30,
            step: 1,
            defaultValue: getDefaultValue('capex.indirect_costs', 'construction_expenditures_contractors_fees', 15),
        },
        {
            label: 'Contingency (% over Total Fixed Capital Investments)',
            name: 'contingency',
            min: 5,
            max: 20,
            step: 5,
            defaultValue: getDefaultValue('capex.indirect_costs', 'contingency', 10),
        }
    ];

    const sliderFieldsProductionCosts = [
        {
            label: 'Raw Material Cost (% over Total Product Cost)',
            name: 'raw_material_cost',
            min: 30,
            max: 60,
            step: 5,
            defaultValue: getDefaultValue('product_cost.production_costs', 'raw_material_cost', 40),
        },
        {
            label: 'Operational Labor Cost (% over Total Product Cost)',
            name: 'operational_labor_cost',
            min: 10,
            max: 20,
            step: 2,
            defaultValue: getDefaultValue('product_cost.production_costs', 'operational_labor_cost', 10),
        },
        {
            label: 'Direct Supervision and Office Work Cost (% over Total Product Cost)',
            name: 'direct_supervision_office_work_cost',
            min: 2,
            max: 2.5,
            step: 0.1,
            defaultValue: getDefaultValue('product_cost.production_costs', 'direct_supervision_office_work_cost', 2),
        },
        {
            label: 'Utilities and Waste Treatment Cost (% over Total Product Cost)',
            name: 'utilities_waste_treatment_cost',
            min: 10,
            max: 20,
            step: 1,
            defaultValue: getDefaultValue('product_cost.production_costs', 'utilities_waste_treatment_cost', 10),
        },
        {
            label: 'Maintenance and Repairs Cost (% over Fixed Capital Investment)',
            name: 'maintenance_repairs_cost',
            min: 2,
            max: 10,
            step: 1,
            defaultValue: getDefaultValue('product_cost.production_costs', 'maintenance_repairs_cost', 2),
        },
        {
            label: 'Operation Supplies Cost (% over Fixed Capital Investment)',
            name: 'operation_supplies_cost',
            min: 0.5,
            max: 1,
            step: 0.1,
            defaultValue: getDefaultValue('product_cost.production_costs', 'operation_supplies_cost', 0.5),
        },
        {
            label: 'Laboratory Charges (% over Total Product Cost)',
            name: 'laboratory_charges_cost',
            min: 0,
            max: 2,
            step: 0.1,
            defaultValue: getDefaultValue('product_cost.production_costs', 'laboratory_charges_cost', 0.5),
        },
        {
            label: 'Patents and Royalties (% over Total Product Cost)',
            name: 'patents_royalties_cost',
            min: 0,
            max: 6,
            step: 0.5,
            defaultValue: getDefaultValue('product_cost.production_costs', 'patents_royalties_cost', 0.5),
        },
        {
            label: 'Depreciation - Buildings (% over Construction Value)',
            name: 'depreciation_buildings',
            min: 2,
            max: 3,
            step: 0.2,
            defaultValue: getDefaultValue('product_cost.production_costs', 'depreciation_buildings', 2),
        },
        {
            label: 'Local Taxes (% over Fixed Capital Investment)',
            name: 'local_taxes',
            min: 1,
            max: 4,
            step: 0.5,
            defaultValue: getDefaultValue('product_cost.production_costs', 'local_taxes', 1),
        },
        {
            label: 'Insurance (% over Fixed Capital Investment)',
            name: 'insurance',
            min: 0.4,
            max: 1,
            step: 0.2,
            defaultValue: getDefaultValue('product_cost.production_costs', 'insurance', 0.4),
        },
        {
            label: 'Rent (% over Land Cost)',
            name: 'rent',
            min: 0,
            max: 12,
            step: 1,
            defaultValue: getDefaultValue('product_cost.production_costs', 'rent', 0),
        },
        {
            label: 'General Plant Expenses (% over Total Product Cost)',
            name: 'general_plant_expenses',
            min: 5,
            max: 15,
            step: 1,
            defaultValue: getDefaultValue('product_cost.production_costs', 'general_plant_expenses', 5),
        }
    ];

    const sliderFieldsGeneralExpenditures = [
        {
            label: 'Administrative Costs (% over Total Product Cost)',
            name: 'administrative_costs',
            min: 2,
            max: 6,
            step: 0.5,
            defaultValue: getDefaultValue('product_cost.general_expenditures', 'administrative_costs', 3),
        },
        {
            label: 'Distribution and Selling Costs (% over Total Product Cost)',
            name: 'distribution_selling_costs',
            min: 2,
            max: 20,
            step: 1,
            defaultValue: getDefaultValue('product_cost.general_expenditures', 'distribution_selling_costs', 5),
        },
        {
            label: 'Research and Development Costs (% over Total Product Cost)',
            name: 'research_development_costs',
            min: 5,
            max: 15,
            step: 1,
            defaultValue: getDefaultValue('product_cost.general_expenditures', 'research_development_costs', 5),
        },
        {
            label: 'Financing (% over Total Capital Investment)',
            name: 'financing',
            min: 0,
            max: 10,
            step: 1,
            defaultValue: getDefaultValue('product_cost.general_expenditures', 'financing', 0),
        }
    ];

    return (
        <form onSubmit={submit} className={styles.form}>
            <h2>General Section</h2>
            {inputFields.map((field, idx) => (
                <Input
                    key={field.name}
                    {...field}
                    onChange={handleOnChange}
                />
            ))}
            <h2>CAPEX Section</h2>
            <h3>Direct Costs</h3>
            {sliderFieldsDirectCosts.map((field, idx) => (
                <Slider
                    key={field.name}
                    {...field}
                    onChange={handleOnChange}
                />
            ))}
            <h3>Indirect Costs</h3>
            {sliderFieldsIndirectCosts.map((field, idx) => (
                <Slider
                    key={field.name}
                    {...field}
                    onChange={handleOnChange}
                />
            ))}
            <h2>Product Cost Section</h2>
            <h3>Fabrication Cost</h3>
            {sliderFieldsProductionCosts.map((field, idx) => (
                <Slider
                    key={field.name}
                    {...field}
                    onChange={handleOnChange}
                />
            ))}
            <h3>General Expenditures</h3>
            {sliderFieldsGeneralExpenditures.map((field, idx) => (
                <Slider
                    key={field.name}
                    {...field}
                    onChange={handleOnChange}
                />
            ))}
        <SubmitButton text={txtBtn} />
        </form>
    )
}

export default EconomicInfoForm;