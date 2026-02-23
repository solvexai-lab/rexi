'use server';

import { revalidatePath } from 'next/cache';
import { getAnalysis, updateAnalysis } from '@/lib/insurance/database';
import { calculateScenarios } from '@/lib/insurance/calculator';
import { PolicyData } from '@/lib/insurance/types';

export async function updatePolicyVitals(
    id: string,
    formData: {
        registrationNo: string;
        make: string;
        model: string;
        insurerName: string;
        idv: number;
        premium: number;
        policyNumber?: string;
        expiryDate?: string;
    }
) {
    try {
        // 1. Get current analysis to preserve other fields (like coverages)
        const currentAnalysis = await getAnalysis(id);

        if (!currentAnalysis.policyData) {
            throw new Error('Analysis not found or invalid type');
        }

        // 2. Merge updates into PolicyData
        const updatedPolicyData: PolicyData = {
            ...currentAnalysis.policyData,
            vehicleInfo: {
                ...currentAnalysis.policyData.vehicleInfo,
                make: formData.make,
                model: formData.model,
                registrationNo: formData.registrationNo,
            },
            insurerName: formData.insurerName,
            idv: formData.idv,
            premium: formData.premium,
            policyNumber: formData.policyNumber,
            expiryDate: formData.expiryDate,
        };

        // 3. Recalculate Scenarios (since IDV/Premium changed)
        const updatedScenarios = calculateScenarios(updatedPolicyData);

        // 4. Map to DB constraints
        const dbUpdates = {
            vehicle_registration: formData.registrationNo,
            vehicle_make: formData.make,
            vehicle_model: formData.model,
            insurer_name: formData.insurerName,
            idv: formData.idv,
            premium: formData.premium,
            policy_number: formData.policyNumber,
            expiry_date: formData.expiryDate,
            scenarios: updatedScenarios,
        };

        // 5. Save to DB
        await updateAnalysis(id, dbUpdates);

        // 6. Revalidate
        revalidatePath(`/insurance/dashboard/${id}`);

        return { success: true };
    } catch (error) {
        console.error('Failed to update policy:', error);
        return { success: false, error: 'Failed to update policy' };
    }
}
