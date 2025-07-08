import { useReadContract } from "wagmi";
import deployedContracts from "../../contracts/deployedContracts";
import scaffoldConfig from "../../scaffold.config";

export const useScaffoldReadContract = ({
  contractName,
  functionName,
  args,
  ...readContractConfig
}: {
  contractName: keyof typeof deployedContracts[10143];
  functionName: string;
  args?: readonly unknown[];
} & Omit<Parameters<typeof useReadContract>[0], "abi" | "address" | "functionName" | "args">) => {
  const chainId = scaffoldConfig.targetNetworks[0].id;
  const contract = deployedContracts[chainId][contractName];

  return useReadContract({
    abi: contract.abi,
    address: contract.address,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functionName: functionName as any,
    args: args as readonly [`0x${string}`] | readonly [bigint] | readonly [`0x${string}`, `0x${string}`] | readonly [`0x${string}`, bigint] | undefined,
    ...readContractConfig,
  });
}; 