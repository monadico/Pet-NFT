import { useWriteContract } from "wagmi";
import deployedContracts from "../../contracts/deployedContracts";
import scaffoldConfig from "../../scaffold.config";

export const useScaffoldWriteContract = ({
  contractName,
}: {
  contractName: keyof typeof deployedContracts[10143];
}) => {
  const chainId = scaffoldConfig.targetNetworks[0].id;
  const contract = deployedContracts[chainId][contractName];

  const { writeContract, writeContractAsync, ...writeContractResult } = useWriteContract();

  const writeContractAsyncWithDefaults = async ({
    functionName,
    args,
    value,
    ...writeContractConfig
  }: {
    functionName: string;
    args?: readonly unknown[];
    value?: bigint;
  } & Omit<Parameters<typeof writeContractAsync>[0], "abi" | "address" | "functionName" | "args" | "value" | "type">) => {
    return writeContractAsync({
      abi: contract.abi,
      address: contract.address,
      functionName,
      args,
      value,
      ...writeContractConfig,
    } as Parameters<typeof writeContractAsync>[0]);
  };

  return {
    writeContract,
    writeContractAsync: writeContractAsyncWithDefaults,
    ...writeContractResult,
  };
}; 